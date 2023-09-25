import * as ResizeObserverModule from 'resize-observer-polyfill'
import '@testing-library/jest-dom'
(global as any).ResizeObserver = ResizeObserverModule.default
