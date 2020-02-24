import React, { Component } from "react";
import styles from "./imageStyle.css";

export default class ImageAdd extends Component {
  // Start the popover closed
  state = {
    url: "",
    open: false
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
    } else {
      this.setState({ invalidUrl: "Invalid Url, Enter a valid url" });
    }
  };

  changeUrl = url => {
    this.setState({ url});
    if (this.validateUrl(url || "") && this.state.invalidUrl) {
      this.setState({ invalidUrl: undefined });
    }
  };
  onFileChange = async evt => {
    if(evt.target.files && this.props.uploadImage){
      try{
        const url = await this.props.uploadImage(evt.target.files);
        if(url){
         this.changeUrl(url)
        }
      }catch(err){
        throw new Error("Upload Failed")
      }
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
        {/* <button
          className={buttonClassName}
          onMouseUp={this.openPopover}
          type="button"
        >
          +
        </button> */}
        <div className={popoverClassName} onClick={this.onPopoverClick}>
          <div className="url-container">
            {this.props.uploadImage ? <input type="file" accept={accept || 'image/*'} onChange={this.onFileChange}/> : <input
              className="url-input"
              type="text"
              placeholder="Paste the image url …"
              className={styles.addImageInput}
              onChange={this.changeUrl}
              value={this.state.url}
            />}
            
            {this.state.invalidUrl && (
              <span className="invalid">{this.state.invalidUrl}</span>
            )}
          </div>
          <div className="image-button-container">
            <button
              disabled={!this.state.url || this.state.url === ""}
              className={
                this.props.imageButtonClassName || styles.addImageConfirmButton
              }
              type="button"
              onClick={this.addImage}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  }
}
