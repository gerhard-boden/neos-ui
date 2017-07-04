import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import ButtonGroup from '@neos-project/react-ui-components/src/ButtonGroup/';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import {neos} from '@neos-project/neos-ui-decorators';
import I18n from '@neos-project/neos-ui-i18n';

import style from './style.css';

const MODE_AFTER = 'after';
const MODE_BEFORE = 'before';
const MODE_INTO = 'into';

//
// In case no mode is provided initially, this function is used to determine,
// which mode should be preselected then.
//
// If the `into` mode is allowed, it should always be preferred.
//
// Otherwise `after` should be preferred, since `before` is a rather exceptional
// choice.
//
const calculatePreferredInitialMode = props => {
    const {enableAlongsideModes, enableIntoMode} = props;

    if (enableIntoMode) {
        return MODE_INTO;
    }

    if (enableAlongsideModes) {
        return MODE_AFTER;
    }

    return null;
};

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class InsertModeSelector extends PureComponent {
    static propTypes = {
        mode: PropTypes.string,
        enableAlongsideModes: PropTypes.bool.isRequired,
        enableIntoMode: PropTypes.bool.isRequired,
        onSelect: PropTypes.func.isRequired,

        i18nRegistry: PropTypes.object.isRequired
    };

    constructor(...args) {
        super(...args);

        this.handleSelect = this.handleSelect.bind(this);
        this.options = [];
    }

    selectPreferredInitialModeIfModeIsEmpty(props) {
        const {mode, onSelect} = props;
        let reconsiderMode = !mode;

        if (mode === MODE_INTO && !props.enableIntoMode) {
            reconsiderMode = true;
        }

        if ((mode === MODE_AFTER || mode === MODE_BEFORE) && !props.enableAlongsideModes) {
            reconsiderMode = true;
        }

        if (reconsiderMode) {
            const preferredInitialMode = calculatePreferredInitialMode(props);

            if (preferredInitialMode) {
                onSelect(preferredInitialMode);
            }
        }
    }

    componentWillMount() {
        this.selectPreferredInitialModeIfModeIsEmpty(this.props);
    }

    componentWillReceiveProps(props) {
        this.selectPreferredInitialModeIfModeIsEmpty(props);
    }

    render() {
        const {mode, enableIntoMode, enableAlongsideModes, i18nRegistry} = this.props;

        if (!mode) {
            return null;
        }

        return (
            <div className={style.root}>
                <I18n id="Neos.Neos.Ui:Main:insertMode"/>:&nbsp;
                <ButtonGroup value={mode} onSelect={this.handleSelect}>
                    <IconButton
                        id={MODE_BEFORE}
                        isDisabled={!enableAlongsideModes}
                        style="lighter"
                        size="small"
                        icon="level-up"
                        title={`${i18nRegistry.translate('Neos.Neos.Ui:Main:insert')} ${i18nRegistry.translate('before')}`}
                        />
                    <IconButton
                        id={MODE_INTO}
                        isDisabled={!enableIntoMode}
                        style="lighter"
                        size="small"
                        icon="long-arrow-right"
                        title={`${i18nRegistry.translate('Neos.Neos.Ui:Main:insert')} ${i18nRegistry.translate('into')}`}
                        />
                    <IconButton
                        id={MODE_AFTER}
                        isDisabled={!enableAlongsideModes}
                        style="lighter"
                        size="small"
                        icon="level-down"
                        title={`${i18nRegistry.translate('Neos.Neos.Ui:Main:insert')} ${i18nRegistry.translate('after')}`}
                        />
                </ButtonGroup>
            </div>
        );
    }

    handleSelect(mode) {
        const {onSelect} = this.props;

        onSelect(mode);
    }
}
