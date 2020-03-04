import React, { useState, useEffect } from 'react';
import CustomInlineToolbarEditor from '../lib';
import {EditorState} from 'draft-js';
const App = () => {
    const [editorState,setEditorState] = useState()
    useEffect(()=>{
setEditorState(EditorState.createEmpty())
    },[])
    return (
        <React.Fragment>
            {editorState ? <CustomInlineToolbarEditor
            editorState={editorState}
            imageButtonClassName={'btn btn-sm btn-green'}
            onChange={setEditorState}
            // imageUploadFn={this.props.uploadImage}
            />:'Loading...'}
        </React.Fragment>
    )
}

export default App;