import React, { useState } from 'react';
import CustomInlineToolbarEditor from '../lib';
import {EditorState} from 'draft-js';
const App = () => {
    const [editorState,setEditorState] = useState(EditorState.createEmpty())
    return (
        <React.Fragment>
            <CustomInlineToolbarEditor
            editorState={editorState}
            imageButtonClassName={'btn btn-sm btn-green'}
            onChange={setEditorState}
            // imageUploadFn={this.props.uploadImage}
            />
        </React.Fragment>
    )
}

export default App;