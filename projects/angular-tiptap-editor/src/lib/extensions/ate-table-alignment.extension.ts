import { Editor, Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

type TableAlignment = "left" | "center" | "right";

const TABLE_ALIGNMENT_VALUES: readonly TableAlignment[] = ["left", "center", "right"];

function isTableAlignment(value: unknown): value is TableAlignment {
  return typeof value === "string" && TABLE_ALIGNMENT_VALUES.includes(value as TableAlignment);
}

function getTableAlignment(value: unknown): TableAlignment | null {
  return isTableAlignment(value) ? value : null;
}

function findTableElement(nodeDom: Node | null): HTMLTableElement | null {
  if (nodeDom instanceof HTMLTableElement) {
    return nodeDom;
  }

  if (nodeDom instanceof HTMLElement) {
    return nodeDom.querySelector("table");
  }

  return null;
}

function syncTableAlignmentAttributes(editor: Editor): void {
  const { view } = editor;

  view.state.doc.descendants((node, pos) => {
    if (node.type.name !== "table") {
      return;
    }

    const align = getTableAlignment(node.attrs["align"]);
    const tableElement = findTableElement(view.nodeDOM(pos));

    if (!tableElement) {
      return;
    }

    const tableWrapper = tableElement.closest(".tableWrapper");

    if (align) {
      tableElement.setAttribute("data-align", align);
      tableWrapper?.setAttribute("data-align", align);
      return;
    }

    tableElement.removeAttribute("data-align");
    tableWrapper?.removeAttribute("data-align");
  });
}

export const AteTableAlignmentExtension = Extension.create({
  name: "tableAlignment",
  addGlobalAttributes() {
    return [
      {
        types: ["table"],
        attributes: {
          align: {
            default: null,
            parseHTML: (element: HTMLElement) => {
              const alignValue =
                element.getAttribute("data-align") ?? element.getAttribute("align");
              return getTableAlignment(alignValue);
            },
            renderHTML: (attributes: Record<string, unknown>) => {
              const alignValue = getTableAlignment(attributes["align"]);
              return alignValue ? { "data-align": alignValue } : {};
            },
          },
        },
      },
    ];
  },
  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        key: new PluginKey("table-alignment-dom-sync"),
        view: () => {
          queueMicrotask(() => syncTableAlignmentAttributes(editor));

          return {
            update: (view, previousState) => {
              if (view.state.doc.eq(previousState.doc)) {
                return;
              }

              syncTableAlignmentAttributes(editor);
            },
          };
        },
      }),
    ];
  },
});
