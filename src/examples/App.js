import React from 'react';
import CustomInlineToolbarEditor from '../lib';
import {EditorState} from 'draft-js';

class App extends React.Component {
    state={
        editorState: EditorState.createEmpty()
    }
    setEditorState = (editorState) =>{
        if(editorState){
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