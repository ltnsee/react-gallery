require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关信息
let imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片名信息转换成图片路径
imageDatas = (function genImageURL(imageDatasArr) {
  for (let i = 0, j = imageDatasArr.length; i < j; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);

    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);



/**
 * 取一个给定区间的一个随机值
 * @param {最小值} low
 * @param {最大值} high
 */
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

/**
 * 获取0~30° 之间的任意正负值
 */
function get30DegRandom() {
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
  }

  render() {

    let styleObj = {}


    // 如果 props 属性中指定了这张图片的位置。则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    // 如果图片的旋转角度有值并且不为0，添加旋转角度
    if (this.props.arrange.rotate) {
      (['Moz', 'ms', 'Webkit', '']).forEach(((value) => {
        styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }).bind(this));
    }

    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }

    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [
        /*{
          pos:{//定位坐标
            left:'0',
            top:'0'
          },
          rotate:0,//旋转角度
          isInverse: false, //图片正反面
          isCenter: false //图片是否居中
        }*/
      ]
    };
  }


  Constant = {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {//水平方向的范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {//垂直方向的取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  }

  /**
   * 翻转图片
   * @param {输入当前被执行inverse操作的图片对应的图片信息数组的index值} index
   * @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
   */
  inverse(index) {
    return (() => {
      let imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }).bind(this);
  }


  /**
   * 重新布局所有图片
   * @param {指定居中那张图片} centerIndex
   */
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosrRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosrRange.leftSecX,
      hPosRangeRightSecX = hPosrRange.rightSecX,
      hPosRangeY = hPosrRange.y,

      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],//存放所有图片的状态信息
      topImgNum = Math.ceil(Math.random() * 2),
      // 取一个或不取
      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    // 首先居中 centerIndex 图片,居中 centerIndex 图片不需要翻转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    }

    // 取出要布局上册的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));

    // 要布局上册的图片位置信息
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    // 布局位于上册的图片
    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    });

    // 布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {

      let hPosRangeLORX = null;

      // 前半部分布局在左边，后半部分布局在右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    }

    // 填充上册位置的图片信息
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    // 填充中心位置的图片信息
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    // 设置当前 state 的值
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })
  }

  center(index) {
    return (() => {
      this.rearrange(index);
    }).bind(this);
  }

  // 组件加载以后，为每张图片计算其位置的范围
  componentDidMount() {
    // 首先拿到舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    // 拿到一个ImgFigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.ImgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    // 计算中心图片位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 计算左侧、右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;


    this.rearrange(0);//

  }

  render() {
    let controllerUnits = [];

    let ImgFigures = imageDatas.map(((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      return <ImgFigure key={index} data={value} ref={'ImgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />
    }).bind(this));



    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {ImgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
