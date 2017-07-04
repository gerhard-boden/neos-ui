import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import Dropzone from 'react-dropzone';

import {Thumbnail} from '../../Utils/index';
import style from './style.css';

export default class PreviewScreen extends PureComponent {
    static propTypes = {
        image: PropTypes.object,
        onDrop: PropTypes.func.isRequired,
        onClick: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.setDropDownRef = this.setDropDownRef.bind(this);
    }

    chooseFromLocalFileSystem() {
        this.dropzone.open();
    }

    render() {
        const {image, onDrop, onClick, isLoading} = this.props;

        if (isLoading) {
            return (
                <div className={style.thumbnail}>
                    <Icon icon="spinner" spin={true} size="big" className={style.thumbnail__loader}/>
                </div>
            );
        }
        const thumbnail = image ? Thumbnail.fromImageData(image, 273, 216) : null;

        return (
            <Dropzone
                ref={this.setDropDownRef}
                onDropAccepted={onDrop}
                className={style.dropzone}
                activeClassName={style['dropzone--isActive']}
                rejectClassName={style['dropzone--isRejecting']}
                disableClick={true}
                multiple={false}
                >
                <div
                    className={style.thumbnail}
                    onClick={onClick}
                    >
                    <div className={style.cropArea} style={(thumbnail ? thumbnail.styles.cropArea : {})}>
                        <img
                            className={(thumbnail ? style.cropArea__image : style['cropArea__image--placeholder'])}
                            src={thumbnail ? thumbnail.uri : '/_Resources/Static/Packages/Neos.Neos/Images/dummy-image.svg'}
                            style={thumbnail ? thumbnail.styles.thumbnail : {}}
                            role="presentation"
                            />
                    </div>
                </div>
            </Dropzone>
        );
    }

    setDropDownRef(ref) {
        this.dropzone = ref;
    }
}
