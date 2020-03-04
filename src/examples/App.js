import React from 'react';
import CustomInlineToolbarEditor from '../lib';
import {EditorState} from 'draft-js';
// import draftToHtml from 'draftjs-to-html';

class App extends React.Component {
    state={
        editorState: EditorState.createEmpty()
    }
    // customEntityTransform = (entity, text) => {
    //     switch (entity.type) {
    //       case 'INLINETEX':
    //         return '';
  
    //       case 'KateX':
    //         return katex.renderToString(entity.data.value, {
    //           throwOnError: false,
    //         });
  
    //       default:
    //         return '';
    //     }
    //   };
    setEditorState = (editorState) =>{
        if(editorState){
            // const rawContent = editorState.getCurrentContent()
            // const draft =draftToHtml(rawContent, {}, false, this.customEntityTransform)
            // console.log(draft)
        this.setState({editorState})
        }
    }
    render(){
        return (
            <React.Fragment>
                {this.state.editorState ? <CustomInlineToolbarEditor
                editorState={this.state.editorState}
                imageButtonClassName={'btn btn-sm btn-green'}
                onChange={this.setEditorState}
                // imageUploadFn={this.props.uploadImage}
                />:'Loading...'}
            </React.Fragment>
        )
    }
}
export default App;