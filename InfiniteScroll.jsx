import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

function topPosition(element) {
  if (!element) return 0;
  return element.offsetTop + topPosition(element.offsetParent);
}

InfiniteScroll = class InfiniteScroll extends Component {
  constructor(props) {
    super(props);
    this.scrollListener = this.scrollListener.bind(this);
    this.attachScrollListener = this.attachScrollListener.bind(this);
    this.detachScrollListener = this.detachScrollListener.bind(this);
  }

  componentDidMount() {
    const { pageStart } = this.props;
    this.pageLoaded = pageStart;
    this.attachScrollListener();
  }

  componentDidUpdate() {
    this.attachScrollListener();
  }

  scrollListener() {
    const { threshold, loadMore, dontUseWindow } = this.props;
    const component = ReactDOM.findDOMNode(this);
    const scrollElement = window;

    let offset;
    if(dontUseWindow) {
      offset = component.offsetHeight - component.parentNode.scrollTop - component.parentNode.clientHeight;
    } else {
      const scrollTop = (scrollElement.pageYOffset !== undefined) ? scrollElement.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      offset = topPosition(component) + component.offsetHeight - scrollTop - window.innerHeight;
    }

    if (offset < Number(threshold)) {
      this.detachScrollListener();
      loadMore(this.pageLoaded += 1);
    }
  }

  attachScrollListener() {
    const { dontUseWindow } = this.props;
    const { hasMore } = this.props;
    if (!hasMore) return;

    let scrollComponent = window;
    if(dontUseWindow) scrollComponent = ReactDOM.findDOMNode(this).parentNode;

    scrollComponent.addEventListener('scroll', this.scrollListener);
    scrollComponent.addEventListener('resize', this.scrollListener);
    this.scrollListener();
  }

  detachScrollListener() {
    const { dontUseWindow } = this.props;
    let scrollComponent = window;
    if(dontUseWindow) scrollComponent = ReactDOM.findDOMNode(this).parentNode;

    scrollComponent.removeEventListener('scroll', this.scrollListener);
    scrollComponent.removeEventListener('resize', this.scrollListener);
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  render() {
    const { children, hasMore, loader, Wrapper } = this.props;
    const loaderDOMItem = hasMore && loader;

    return (
      <Wrapper>
        {children}
        {loaderDOMItem}
      </Wrapper>
    );
  }
}

InfiniteScroll.PropTypes = {
  pageStart: PropTypes.number,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func.isRequired,
  threshold: PropTypes.number,
  Wrapper: PropTypes.any,
  dontUseWindow: React.PropTypes.bool
};

InfiniteScroll.defaultProps = {
  pageStart: 0,
  hasMore: false,
  loadMore() {},
  threshold: 20,
  dontUseWindow: false,
  Wrapper: (props) => <div>{props.children}</div>
};

export default InfiniteScroll;
