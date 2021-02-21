# Monkey Patch Custom Elements Registry

Simple example of monkey patching the [Custom Elements Registry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry) to allow live update of elements without the need of a full page refresh.

This will avoid the usual error:

> Uncaught DOMException: Failed to execute 'define' on 'CustomElementRegistry': the name "..." has already been used with this registry

## How it works?

A wrapper element is created the first time and defined within the registry. It will points to the custom element inside his template.

As the custom element is updated, a new version of it will be defined in the registry. The wrapper element will now point to its latest version.

In case some old versions of it were already present on the page, the wrapper elements template will re-render.
