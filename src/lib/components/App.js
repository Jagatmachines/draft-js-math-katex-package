import React, { Component } from "react";

import { convertToRaw, EditorState, convertFromRaw } from "draft-js";
import Editor, {
  createEditorStateWithText,
  composeDecorators
} from "draft-js-plugins-editor";
// import MathJax from 'mathjax';

import createImagePlugin from "draft-js-image-plugin";

import createFocusPlugin from "draft-js-focus-plugin";

import createBlockDndPlugin from "draft-js-drag-n-drop-plugin";
import createDragNDropUploadPlugin from "@mikeljames/draft-js-drag-n-drop-upload-plugin";

import createResizeablePlugin from "draft-js-resizeable-plugin";
import createAlignmentPlugin from "draft-js-alignment-plugin";

import createCodeEditorPlugin from "draft-js-code-editor-plugin";
import Prism from "prismjs";
import createPrismPlugin from "draft-js-prism-plugin";

import createToolbarPlugin, { Separator } from "draft-js-static-toolbar-plugin";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton
} from "draft-js-buttons";

import draftToHtml from "draftjs-to-html";

import createKaTeXPlugin from "draft-js-katex-plugin";
import katex from "katex";

import mockUpload from "./mockUpload";
import ImageAdd from "./imageAdd";

import "draft-js-image-plugin/lib/plugin.css";
import "draft-js-alignment-plugin/lib/plugin.css";
import "draft-js-static-toolbar-plugin/lib/plugin.css";
// import 'katex/dist/katex.min.css';
// import "prismjs/themes/prism.css";
import "./editorStyles.css";

// import createMathjaxPlugin from 'draft-js-mathjax-plugin'
// const mathjaxPlugin = createMathjaxPlugin(/* optional configuration object */)

const kaTeXPlugin = createKaTeXPlugin({
  // the configs here are mainly to show you that it is possible. Feel free to use w/o config
  doneContent: { valid: "Close", invalid: "Invalid syntax" },
  katex, // <-- required
  // MathInput: /* props.withMathInput ? MathInput : */ null,
  removeContent: "Remove",
  /* theme: {
    insertButton: 'Button Button-small Button-insert',
  }, */
  theme: {
    saveButton: "save-btn",
    removeButton: "remove-btn"
  }
  //translator: /* props.withAsciimath ? asciimath2latex :  */null,
});
const { InsertButton } = kaTeXPlugin;
// const plugins = [kaTeXPlugin];

const resizeablePlugin = createResizeablePlugin();
const focusPlugin = createFocusPlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const codeEditorPlugin = createCodeEditorPlugin();

const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator,
  alignmentPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });
const prismPlugin = createPrismPlugin({ prism: Prism });

const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
  handleUpload: mockUpload,
  addImage: imagePlugin.addImage
});

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;

class HeadlinesPicker extends Component {
  componentDidMount() {
    setTimeout(() => {
      window.addEventListener("click", this.onWindowClick);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onWindowClick);
  }

  onWindowClick() {
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.
    this.props.onOverrideContent(undefined);
  }

  render() {
    return (
      <div>
        <HeadlineOneButton {...this.props} />
        <HeadlineTwoButton {...this.props} />
        <HeadlineThreeButton {...this.props} />
      </div>
    );
  }
}

class HeadlinesButton extends Component {
  // When using a click event inside overridden content, mouse down
  // events needs to be prevented so the focus stays in the editor
  // and the toolbar remains visible  onMouseDown = (event) => event.preventDefault()
  onMouseDown = event => event.preventDefault();

  onClick = () =>
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
    this.props.onOverrideContent(HeadlinesPicker);

  render() {
    return (
      <div onMouseDown={this.onMouseDown} className="headlineButtonWrapper">
        <button onClick={this.onClick} className="headlineButton">
          H
        </button>
      </div>
    );
  }
}

// const inlineToolbarPlugin = createInlineToolbarPlugin();
const plugins = [
  blockDndPlugin,
  focusPlugin,
  imagePlugin,
  /* dragNDropFileUploadPlugin, */
  resizeablePlugin,
  alignmentPlugin,
  toolbarPlugin,
  kaTeXPlugin,
  prismPlugin,
  codeEditorPlugin
];
const text =
  "In this editor a toolbar shows up once you select part of the text …";
/* eslint-disable */
const initialState = {
  entityMap: {
    "0": {
      type: "IMAGE",
      mutability: "IMMUTABLE",
      data: {
        src: "/images/canada-landscape-small.jpg"
      }
    }
  },
  blocks: [
    {
      key: "9gm3s",
      text:
        "You can have images in your text field which are draggable. Hover over the image press down your mouse button and drag it to another position inside the editor.",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    },
    {
      key: "ov7r",
      text: " ",
      type: "atomic",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 0
        }
      ],
      data: {}
    },
    {
      key: "e23a8",
      text:
        "You can checkout the alignment tool plugin documentation to see how to build a compatible block plugin …",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    }
  ]
};
/* eslint-enable */

export const codeBlockShow = editorState => {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  const customEntityTransform = (entity, text) => {
    switch (entity.type) {
      case "INLINETEX":
        // console.log(MathJax);
        debugger;
        return "";

      case "KateX":
        return katex.renderToString(entity.data.value, {
          throwOnError: false
        });

      default:
        return "";
    }
  };
  const markup = draftToHtml(rawContentState, {}, false, customEntityTransform);

  return markup;
};

export default class CustomInlineToolbarEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // editorState: createEditorStateWithText(text),
      editorState: EditorState.createEmpty()
      // rawCodeState: ''
    };
  }

  /* componentDidMount() {
    console.log(this.state);
    // html = stateToHTML(contentState);
    const convertRaw = stateToHTML;
    const convertHT = convertToHTML;
    debugger;
  } */

  onChange = editorState => {
    this.setState({
      editorState
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="editor" onClick={this.focus}>
          <Toolbar>
            {// may be use React.Fragment instead of div to improve perfomance after React 16
            externalProps => (
              <div>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                {/* <CodeButton {...externalProps} /> */}
                <Separator {...externalProps} />
                {/* <HeadlinesButton {...externalProps} /> */}
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <CodeBlockButton {...externalProps} />
                <Separator {...externalProps} />
                <InsertButton initialValue="Click\:Here\:to\:Enter\:Equation\:in\:LaTeX">
                  F(x)
                </InsertButton>
              </div>
            )}
          </Toolbar>
          <Editor
            editorState={this.props.editorState}
            onChange={this.props.onChange}
            plugins={plugins}
            ref={element => {
              this.editor = element;
            }}
            {...this.props}
          />
          <ImageAdd
            imageButtonClassName={this.props.imageButtonClassName}
            editorState={this.props.editorState}
            onChange={this.props.onChange}
            modifier={imagePlugin.addImage}
          />

          <AlignmentTool />
        </div>

        {/* <code>
          '{codeBlockShow(this.state.editorState)}'
        </code> */}
      </React.Fragment>
    );
  }
}
