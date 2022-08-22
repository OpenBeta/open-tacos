# Toast mini-mod

minimal implementation of https://github.com/fkhadra/react-toastify#readme using the UI components we already have access to.

There are instances where an error boundary is so far from the scope of what you are presently working on that you just ignore updating the UI at all for errors, maybe just throw a console.error and move on. For instances like that, consider using this instead. A toast will be shown no matter where in the (client side) program it is called. No error / success state, just simple.

Calling this from the server-side will do absolutely nothing, but you COULD potentially build a queue that displays the messages as soon as hydration finishes.

Let's say you're writing something quick, and you realize something might throw an error. You can do

```js
fetch('/api/dangerous')
    .then(setData)
    .catch(() => toast.error("Oh snap! That wasn't supposed to happen"))
```

You could add a button to send the user straight to the github issues list like

```js
fetch('/api/dangerous')
    .then(setData)
    .catch(() => toast.error("Oh snap! That wasn't supposed to happen", { 
        onAction: () => window.navigate('url'), 
        actionButton: 'Github Issues'
        }))
```

The toast event lifecycle will work under the hood to render this for you, without any janky dom-injection.