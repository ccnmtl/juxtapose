import React from 'react';


export default class Playhead extends React.Component {
    render() {
        let currentPos = 0;
        if (this.props.duration !== 0) {
            currentPos = (this.props.currentTime / this.props.duration);
        }

        const clientWidth = this.el ? this.el.clientWidth : 0;
        const offsetLeft = this.el ? this.el.offsetLeft : 0;
        const x = clientWidth * currentPos + offsetLeft;
        const lineStyle = {left: x + 'px'};

        return <div>
            <div ref={(ref) => this._line = ref}
                 className="jux-playhead-line"
                 style={lineStyle}>
                <div className="jux-playhead-top-cutpoint"></div>

                <div className="jux-playhead-bottom-cutpoint"></div>
            </div>
            <input type="range" min="0" max="1000"
                   ref={(ref) => this.el = ref}
                   onChange={this.props.onChange}
                   value={currentPos * 1000} />
        </div>;
    }
}
