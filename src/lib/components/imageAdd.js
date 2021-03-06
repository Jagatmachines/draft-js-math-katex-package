import React, { Component } from "react";
import styles from "./imageStyle.css";

export default class ImageAdd extends Component {
  // Start the popover closed
  fileInput = React.createRef()
  state = {
    url: "",
    open: false,
    file:{
      name:''
    },
    isUploading: false
  };

  // When the popover is open and users click anywhere on the page,
  // the popover should close
  componentDidMount() {
    document.addEventListener("click", this.closePopover);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.closePopover);
  }

  // Note: make sure whenever a click happens within the popover it is not closed
  onPopoverClick = () => {
    this.preventNextClose = true;
  };

  openPopover = () => {
    if (!this.state.open) {
      this.preventNextClose = true;
      this.setState({
        open: true
      });
    }
  };

  closePopover = () => {
    if (!this.preventNextClose && this.state.open) {
      this.setState({
        open: false
      });
    }

    this.preventNextClose = false;
  };
  validateUrl = url => {
    return url.match(/^https?:\/\//);
  };
  addImage = () => {
    const { editorState, onChange } = this.props;
    const { url } = this.state;
    if (url && url !== "" && this.validateUrl(url)) {
      this.setState({ invalidUrl: undefined });
      onChange(this.props.modifier(editorState, url));
      this.resetUploadState()
    } else {
      this.setState({ invalidUrl: "Invalid Url, Enter a valid url" });
    }
  };
  resetUploadState = () => {
    this.setState({url:'',file:{
      name:''
    }})
      if(this.fileInput && this.fileInput.current){
        this.fileInput.current.value=''
      }
  }
  changeUrl = url => {
    this.setState({ url});
    if (this.validateUrl(url || "") && this.state.invalidUrl) {
      this.setState({ invalidUrl: undefined });
    }
  };
  onInputChange = (evt) => {
    const {value} = evt.target;
    this.changeUrl(value)
  }
  onFileChange =  evt => {
    this.changeUrl('')
    this.setState({file:evt.target.files[0] || {name:''}})
    if(evt.target.files && this.props.uploadImage){
        this.setState({isUploading:true})
        this.props.uploadImage(evt.target.files).then((url) => {
          if(url){
            this.changeUrl(url)
          }
          this.setState({isUploading:false})
        }).catch((err) => {
          this.setState({isUploading:false})
          throw new Error("Upload Failed")
        });
    }
  }
  render() {
    const popoverClassName = this.state.open
      ? styles.addImagePopover
      : styles.addImageClosedPopover;
    const buttonClassName = this.state.open
      ? styles.addImagePressedButton
      : styles.addImageButton;
    const {accept} = this.props;
    return (
      <div className={styles.addImage}>
        <div className={popoverClassName} onClick={this.onPopoverClick}>
          <div className="input-group">
          <div className="custom-file">
            {this.props.uploadImage ? <>
              <input type="file" ref={this.fileInput} accept={accept || 'image/*'} onChange={this.onFileChange} className="custom-file-input" id="inputGroupFile04" />
            <label class="custom-file-label" for="inputGroupFile04"> {this.state.file.name || 'Choose file'}</label>
            </> : <input
              className="url-input"
              type="text"
              placeholder="Paste the image url …"
              className={styles.addImageInput}
              onChange={this.onInputChange}
              value={this.state.url}
            />}
            
            {this.state.invalidUrl && (
              <span className="invalid">{this.state.invalidUrl}</span>
            )}
          </div>
          <div className="input-group-append">
            <button
              disabled={!this.state.url || this.state.url === "" || this.state.isUploading}
              className={
                this.props.imageButtonClassName || styles.addImageConfirmButton
              }
              type="button"
              onClick={this.addImage}
            >
              {this.state.isUploading ? 'Uploading...': 'Add'}
            </button>
          </div>
          </div>
        </div>
      </div>
    );
  }
}
