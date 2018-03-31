require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

// 获取图片相关信息
let imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片名信息转换成图片路径
imageDatas = (function genImageURL(imageDatasArr){
  for(let i=0,j=imageDatasArr.length;i<j;i++){
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = requier('../images/'+singleImageData.fileName);

    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);


class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav"></nav>    
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
