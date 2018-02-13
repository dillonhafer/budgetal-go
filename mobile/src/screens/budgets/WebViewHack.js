import React, { PureComponent } from 'react';
import { WebView } from 'react-native';

const html = `
<input id='csv' type="file" accept="text/csv,text/plain">
<script>
  function selectFile(event) {
    document.getElementById('csv').click();
  }
  function getBase64(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      window.postMessage(reader.result)
    };
    reader.onerror = function (error) {
      console.log("Something went wrong:", error)
    };
  }
  document.getElementById('csv').addEventListener('change', getBase64)
</script>
`;

class WebViewHack extends PureComponent {
  render() {
    const { onSelectFile } = this.props;

    return (
      <WebView
        ref={webview => (this.webview = webview)}
        onMessage={onSelectFile}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: 0,
          height: 0,
        }}
        source={{
          html,
        }}
      />
    );
  }
}

export default WebViewHack;
