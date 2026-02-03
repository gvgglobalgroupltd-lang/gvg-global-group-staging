import { Code, Server, Cloud, Users, CheckCircle, Clock, AlertCircle, BarChart3 } from 'lucide-react'

export default function TechDivisionPage() {
    const projects = [
        { id: 1, name: 'Enterprise CRM System', client: 'TechCorp Ltd', status: 'In Progress', progress: 65, team: 8, deadline: '2024-04-15' },
        { id: 2, name: 'Cloud Migration', client: 'Finance Global', status: 'Planning', progress: 25, team: 5, deadline: '2024-05-20' },
        { id: 3, name: 'Mobile App Development', client: 'RetailMax Inc', status: 'In Progress', progress: 80, team: 6, deadline: '2024-03-30' },
        { id: 4, name: 'Infrastructure Upgrade', client: 'Manufacturing Pro', status: 'Completed', progress: 100, team: 4, deadline: '2024-02-28' },
    ]

    const services = [
        { icon: Code, title: 'Custom Software Development', description: 'Tailored solutions for your business needs', activeProjects: 8 },
        { icon: Cloud, title: 'Cloud Infrastructure', description: 'AWS, Azure, Google Cloud deployment', activeProjects: 5 },
        { icon: Server, title: 'IT Consulting', description: 'Strategic technology advisory', activeProjects: 12 },
        { icon: BarChart3, title: 'Data Analytics', description: 'Business intelligence and insights', activeProjects: 6 },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">GVG Tech Division</h1>
                    <p className="text-muted-foreground">IT Consulting, Software Development & Digital Transformation</p>
                </div>
                <div className="px-4 py-2 bg-tech/10 border border-tech/20 rounded-lg">
                    <p className="text-xs text-muted-foreground">Division</p>
                    <p className="text-sm font-semibold text-tech">Technology</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-tech/10 to-transparent border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Code className="w-5 h-5 text-tech" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Active Projects</p>
                    <p className="text-2xl font-bold text-foreground">12</p>
                    <p className="text-xs text-tech">8 in development</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-transparent border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Team Members</p>
                    <p className="text-2xl font-bold text-foreground">48</p>
                    <p className="text-xs text-indigo-600">12 departments</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Completed (YTD)</p>
                    <p className="text-2xl font-bold text-foreground">24</p>
                    <p className="text-xs text-purple-600">100% on time</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-transparent border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Server className="w-5 h-5 text-cyan-600" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Infrastructure</p>
                    <p className="text-2xl font-bold text-foreground">99.9%</p>
                    <p className="text-xs text-cyan-600">Uptime</p>
                </div>
            </div>

            {/* Services Overview */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            className="p-5 bg-gradient-to-br from-tech/5 to-transparent border border-border rounded-lg hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-tech/10 rounded-lg group-hover:bg-tech/20 transition-colors">
                                    <service.icon className="w-6 h-6 text-tech" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground mb-1">{service.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-tech">
                                        <span className="px-2 py-1 bg-tech/10 rounded-full">{service.activeProjects} active projects</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Projects */}
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Project Portfolio</h2>
                    <button className="px-4 py-2 bg-tech hover:bg-tech/90 text-white text-sm font-medium rounded-lg transition-colors">
                        + New Project
                    </button>
                </div>

                <div className="space-y-4">
                    {projects.map((project) => {
                        const statusConfig = {
                            'In Progress': { color: 'bg-blue-500', textColor: 'text-blue-600', bg: 'bg-blue-500/10', icon: Clock },
                            'Planning': { color: 'bg-amber-500', textColor: 'text-amber-600', bg: 'bg-amber-500/10', icon: AlertCircle },
                            'Completed': { color: 'bg-green-500', textColor: 'text-green-600', bg: 'bg-green-500/10', icon: CheckCircle },
                        }
                        const config = statusConfig[project.status as keyof typeof statusConfig]
                        const StatusIcon = config.icon

                        return (
                            <div
                                key={project.id}
                                className="p-5 bg-gradient-to-r from-muted/30 to-transparent border border-border rounded-lg hover:border-tech/30 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-foreground">{project.name}</h3>
                                            <span className={`flex items-center gap-1 px-2 py-1 ${config.bg} ${config.textColor} text-xs rounded-full`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {project.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Client: {project.client}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                                        <p className="text-sm font-medium text-foreground">{new Date(project.deadline).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className="font-semibold text-foreground">{project.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${config.color} transition-all duration-500`}
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {project.team} team members
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Technology Stack */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Technology Stack</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL'].map((tech) => (
                        <div key={tech} className="p-3 bg-gradient-to-br from-tech/5 to-transparent border border-border rounded-lg text-center hover:border-tech/30 transition-all">
                            <p className="text-sm font-medium text-foreground">{tech}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
