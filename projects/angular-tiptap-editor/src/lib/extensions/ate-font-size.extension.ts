import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const AteFontSizeExtension = Extension.create({
  name: "ateFontSize",

  addOptions() {
    return {
      types: ["textStyle"] as string[],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize || null,
            renderHTML: attributes => {
              const fontSize = attributes["fontSize"];
              if (!fontSize) {
                return {};
              }

              return {
                style: `font-size: ${fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        fontSize =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize }).run(),

      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});
