import * as React from "react"

type ToastActionElement = React.ReactElement<any>

type ToastProps = {
    title?: React.ReactNode
    description?: React.ReactNode
    action?: ToastActionElement
    variant?: "default" | "destructive"
    duration?: number
}

type Toast = ToastProps & {
    id: string
    open: boolean
}

type ToasterToast = Toast

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ActionType =
    | { type: "ADD_TOAST"; toast: ToasterToast }
    | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> }
    | { type: "DISMISS_TOAST"; toastId?: string }
    | { type: "REMOVE_TOAST"; toastId?: string }

let count = 0

function genId() {
    count = (count + 1) % Number.MAX_VALUE
    return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string, duration = TOAST_REMOVE_DELAY) => {
    if (toastTimeouts.has(toastId)) {
        return
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId)
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId,
        })
    }, duration)

    toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: Toast[], action: ActionType): Toast[] => {
    switch (action.type) {
        case "ADD_TOAST":
            return [action.toast, ...state].slice(0, TOAST_LIMIT)

        case "UPDATE_TOAST":
            return state.map((t) =>
                t.id === action.toast.id ? { ...t, ...action.toast } : t
            )

        case "DISMISS_TOAST": {
            const { toastId } = action

            if (toastId) {
                // Remove immediately upon dismissal
                addToRemoveQueue(toastId, 0)
            } else {
                state.forEach((toast) => {
                    addToRemoveQueue(toast.id, 0)
                })
            }

            return state.map((t) =>
                t.id === toastId || toastId === undefined
                    ? {
                        ...t,
                        open: false,
                    }
                    : t
            )
        }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return []
            }
            return state.filter((t) => t.id !== action.toastId)
    }
}

const listeners: Array<(state: Toast[]) => void> = []

let memoryState: Toast[] = []

function dispatch(action: ActionType) {
    memoryState = reducer(memoryState, action)
    listeners.forEach((listener) => {
        listener(memoryState)
    })
}

function toast({ duration, ...props }: ToastProps) {
    const id = genId()

    const update = (props: ToasterToast) =>
        dispatch({
            type: "UPDATE_TOAST",
            toast: { ...props, id },
        })
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            duration,
        },
    })

    if (duration) {
        addToRemoveQueue(id, duration)
    }

    return {
        id: id,
        dismiss,
        update,
    }
}

function useToast() {
    const [state, setState] = React.useState<Toast[]>(memoryState)

    React.useEffect(() => {
        listeners.push(setState)
        return () => {
            const index = listeners.indexOf(setState)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }, [state])

    return {
        toast,
        dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
        toasts: state,
    }
}

export { useToast, toast }
export type { ToasterToast, Toast }
