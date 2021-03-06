// Here the JMAP API namespace definition
// It will enable to call the API like that in your code :
// Ex: JMAP_API.Services.User.logout()
// This is the API contract, if changed it has impact on customers

declare namespace JMAP_API {
  // JMAP_API.Service : expose API services
  namespace Service {
    namespace Language {
      function getLocale(): string // EN (default), FR, ES, or PT
      function translate(key: string, params?: string|string[], locale?: string): string
    }
    namespace Project {
      function setId(projectId: string): void
    }
    namespace User {
      function setSessionId(sessionId: string): void
      function login(login: string, password: string): Promise<JLoginData>
      function logout(): Promise<void>
    }
  }

  // JMAP_API.Data : Provide redux store used by api, and also getters to easy access data
  namespace Data {
    function getStore(): any | undefined
    namespace Project {
      function getId(): string
    }
    namespace User {
      function getLocale(): string
      function getSessionId(): string
      function getIdentity(): JUserIdentity
      function getLogin(): string
    }
  }

  // JMAP_API.Component : provide a way to start ui components by your own in the DOM container of your choice
  namespace Component {
    // JMAP_API.Component.UserSession : user session management panel
    const UserSession: JAPIComponent<JUserSessionCmp>
  }

  // JMAP_API.Application : JMap application instance management (not started by default)
  namespace Application {
    function needToStart(): boolean
    function getContainerId(): string
    function getInstance(): React.Component<any, React.ComponentState> | Element | void
    function start(containerId?: string, initOptions?: JAPIApplicationOptions): void
  }

  // JMAP_API.Extension : provide an api to register dynamically an extension
  namespace Extension {
    function register(extensionModel: JExtensionModel): void
    function isRegistered(extensionId: string): boolean // ex : JMAP_API.Extension.isRegistered('Document')
    function getAllRegistered(): string[]
    function renderMouseOver(layerId: string, elementId: string): JExtensionMouseOver[]
    function hasMouseOver(): boolean

    // JMAP_API.Extension.Document : @Optional
    namespace Document {
      const ui_controller: any // @Deprecated
      function selectElement(layer: string, element: string): Promise<void>
      function getElementDocuments(toSelectObjectId: JObjectId): Promise<JDocumentDescriptor[]>
      function selectDocuments(documents: JDocumentDescriptor[]): void
      function filter(filterValue: string | undefined): void
    }
  }
}

declare interface Window {
  JMAP_API_OPTIONS?: any // TODO JAPIOptions
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any
}

interface JDocumentDescriptor {
  identifier: number
  title: string
  description: string
  fileName: string
  creation: number // timestamp
  depositName: string
}

interface JExtensionMouseOver {
  html: string  // static html content
  js?: string   // javascript that will be evaluated after html rendered
}

interface JObjectId {
  project: string
  layer: string
  element: string
}

interface JUserIdentity {
  firstName: string
  lastName: string
  login: string
}

interface JLoginData {
  token: string
  user: JUserPublicData
}

interface JUserPublicData {
  login: string,
  firstname: string,
  lastname: string,
  admin: boolean
}

interface JAPIApplicationOptions {
  start: boolean
  containerId: string
}

interface JAPIComponent<C extends React.Component> {
  create(containerId: string, options: any): React.Component
  destroy(containerId: string): void
  getInstance(containerId: string): React.Component
}

interface JUserSessionCmp extends React.Component<JUserSessionProps, {}>{}
interface JUserSessionProps {
  user?: JUserState
}

interface JUserState {
  identity: JUserIdentity
  token: string
  locale: string
}

interface JUserIdentity {
  firstName: string
  lastName: string
  login: string
}

interface JExtensionModel {
  id: string
  initFn: (options: any) => void
  storeReducer?: (reducerState: any, action: any) => any
  serviceToExpose?: any
  renderMouseOver?(layerId: string, elementId: string): JExtensionMouseOver
}
