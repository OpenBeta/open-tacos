import React, { createElement, Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { autocomplete, AutocompleteOptions, AutocompleteApi } from '@algolia/autocomplete-js';
import '@algolia/autocomplete-theme-classic';

interface AutocompleteProps extends Partial<AutocompleteOptions<any>> {
  queryParams?: {
    text: string;
    data: any;
  };
  label?: string | JSX.Element;
  open?: boolean;
  onCancel?: () => void;
  detached?: boolean;
  resultContainer?: (children: ReactNode[]) => ReactNode;
}

interface SearchProps {
  onCancel?: () => void;
  detached: boolean;
  resultContainer?: (children: ReactNode[]) => ReactNode;
  classNames?: Record<string, string>;
}

const useAutocomplete = (props: SearchProps): AutocompleteApi<any> | null => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRootRef = useRef<any>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  const [search, setSearch] = useState<AutocompleteApi<any> | null>(null);

  useEffect(() => {
    if (containerRef.current == null) {
      return undefined;
    }

    const searchInstance = autocomplete({
      openOnFocus: true,
      classNames: { ...AA_DEFAULT_CLASSES, ...props.classNames },
      defaultActiveItemId: 0,
      container: containerRef.current,
      renderer: { createElement, Fragment, render: () => {} },
      onStateChange: (autocompleteProps) => {
        if (autocompleteProps.prevState.isOpen && !autocompleteProps.state.isOpen) {
          if (props.onCancel != null) props.onCancel();
        }
      },
      detachedMediaQuery: props.detached ? '' : 'none',
      render: ({ children, sections }, root) => {
        if ((panelRootRef.current == null) || rootRef.current !== root) {
          rootRef.current = root;
          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }

        if (props.resultContainer != null) {
          panelRootRef.current.render(props.resultContainer(sections));
        } else {
          panelRootRef.current.render(children);
        }
      },
      ...props
    });

    setSearch(searchInstance);

    return () => {
      if (searchInstance != null) {
        searchInstance.destroy();
      }
    };
  }, [props]);

  return search;
};

export const Autocomplete2 = (props: AutocompleteProps): JSX.Element => {
  const { label, open = false, onCancel, detached = true, queryParams, classNames, resultContainer, ...otherProps } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const search = useAutocomplete({ onCancel, detached, resultContainer, classNames, ...otherProps });

  useEffect(() => {
    if (search != null) {
      search.setIsOpen(open);
    }
  }, [open, search]);

  const onClickHandler = (): void => {
    if (search != null) {
      search.setIsOpen(true);
    }
  };

  return (
    <div className='z-40 inline-flex xl:w-full' ref={containerRef} onClick={onClickHandler}>
      {label}
    </div>
  );
};

// For customization see algolia.css
export const AA_DEFAULT_CLASSES = {
  item: 'aa-default-mobile-item',
  form: 'aa-default-mobile-form',
  submitButton: 'aa-default-mobile-submit-button',
  detachedSearchButton: 'aa-default-mobile-trigger-btn',
  detachedSearchButtonIcon: 'aa-default-mobile-trigger-btn-icon',
  detachedCancelButton: 'aa-default-mobile-cancel-button',
  detachedSearchButtonPlaceholder: 'aa-default-mobile-placeholder'
};
