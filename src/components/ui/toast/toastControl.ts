
interface ToastProps {
  showDismiss?: boolean
  /**
     * The toast may carry a button payload (in addition to the showDismiss action),
     * you may choose to stick a callback on that interaction
     */
  onAccept?: () => void
  /**
     * Set a plain string label for the default button
     */
  actionButton?: string | JSX.Element

  /** optionally supply a title to render */
  title?: string
}

export interface ToastEvent {
  msg: string
  ops: ToastProps
  className: string
  id: string
  lifecycle: 'alive'| 'mustdie'
  ttl?: Date
}

type ToastEventListener = (t: ToastEvent) => void

function makeToast (msg: string, ops: ToastProps, className: string): void {
  const t: ToastEvent = { msg, ops, className, id: `toast - ${new Date().getTime()}`, lifecycle: 'alive' }
  if (ops.showDismiss !== true) {
    // Immediately set a maximum ttl for this toast
    const time = new Date()
    time.setSeconds(time.getSeconds() + 7)
    t.ttl = time
  }

  toast.tq.add(t)
  toast.ll.forEach(listener => listener(t))
}

/**
 * Very simple event architechture for sending events from arbitrary contexts
 * and injecting it into the ToastContainer state. This is a singleton-instance
 * so this should be safe **enough** with reacts impure state model.
 */
const toast = {
  // Event listeners
  ll: new Set<ToastEventListener>([]),
  tq: new Set<ToastEvent>([]),

  _clearListener: (cb: ToastEventListener) => toast.ll.delete(cb),
  _addListener: (cb: ToastEventListener) => toast.ll.add(cb),
  _removeToast: (t: ToastEvent) => {
    toast.tq.delete(t)
    toast.ll.forEach(listener => listener({ ...t, lifecycle: 'mustdie' }))
  },
  // success: (msg: string, ops?: ToastProps): void => { },
  // error: (msg: string, ops?: ToastProps): void => { },
  // warn: (msg: string, ops?: ToastProps): void => { },
  info: (msg: string, ops?: ToastProps): void => {
    makeToast(msg, ops ?? {}, '')
  }
}

export default toast
