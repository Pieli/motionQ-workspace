import React from 'react';
import {
	FAIL_COLOR,
} from '../../helpers/colors';

export type CodemodStatus =
	| {
			type: 'loading';
	  }
	| {
			type: 'fail';
			error: string;
	  };

export const CodemodDiffPreview: React.FC<{
	readonly status: CodemodStatus;
}> = ({status}) => {
	if (status.type === 'loading') {
		return null;
	}

    return (
        <span style={{color: FAIL_COLOR, fontSize: 13, lineHeight: 1.2}}>
            {status.error}
        </span>
    );

};
