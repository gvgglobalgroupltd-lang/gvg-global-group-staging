# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Get a Quote" [ref=e3]:
    - img
    - text: Get a Quote
  - generic [ref=e5]:
    - generic [ref=e6]:
      - img [ref=e8]
      - heading "GVG Global Group" [level=1] [ref=e12]
      - paragraph [ref=e13]: Enterprise Resource Planning Portal
    - generic [ref=e14]:
      - heading "Sign In" [level=2] [ref=e15]
      - generic [ref=e16]:
        - generic [ref=e17]:
          - text: Email Address
          - generic [ref=e18]:
            - img [ref=e19]
            - textbox "Email Address" [ref=e22]:
              - /placeholder: admin@gvg.com
        - generic [ref=e23]:
          - text: Password
          - generic [ref=e24]:
            - img [ref=e25]
            - textbox "Password" [ref=e28]:
              - /placeholder: ••••••••
        - button "Sign In" [ref=e29]
      - paragraph [ref=e31]: Access restricted to authorized personnel only
  - region "Notifications (F8)":
    - list
  - button "Open Next.js Dev Tools" [ref=e37] [cursor=pointer]:
    - img [ref=e38]
  - alert [ref=e41]
```