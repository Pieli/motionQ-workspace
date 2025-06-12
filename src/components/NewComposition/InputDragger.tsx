import type {
	InputHTMLAttributes,
	MouseEventHandler,
	PointerEventHandler,
} from 'react';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {interpolate} from 'remotion';
import {BLUE} from '../../helpers/colors';
import type {RemInputStatus} from './RemInput';
import {inputBaseStyle} from './RemInput';

type Props = InputHTMLAttributes<HTMLInputElement> & {
	readonly onValueChange: (newVal: number) => void;
	readonly onTextChange: (newVal: string) => void;
	readonly status: RemInputStatus;
	readonly formatter?: (str: number | string) => string;
	readonly rightAlign: boolean;
};


const InputDraggerForwardRefFn: React.ForwardRefRenderFunction<
	HTMLButtonElement,
	Props
> = (
	{
		onValueChange,
		min: _min,
		max: _max,
		step: _step,
		value,
		formatter = (q) => String(q),
	},
	ref,
) => {
	const [inputFallback, setInputFallback] = useState(false);
	const fallbackRef = useRef<HTMLInputElement>(null);
	const style = useMemo(() => {
		return {
			...inputBaseStyle,
			backgroundColor: 'transparent',
			borderColor: 'transparent',
		};
	}, []);

	const span: React.CSSProperties = useMemo(
		() => ({
			borderBottom: '1px dotted ' + BLUE,
			paddingBottom: 1,
			color: BLUE,
			cursor: 'ew-resize',
			userSelect: 'none',
			WebkitUserSelect: 'none',
			fontSize: 13,
			fontVariantNumeric: 'tabular-nums',
		}),
		[],
	);

	const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
		setInputFallback(true);
	}, []);


	const roundToStep = (val: number, stepSize: number) => {
		const factor = 1 / stepSize;
		return Math.ceil(val * factor) / factor;
	};

	const onPointerDown: PointerEventHandler = useCallback(
		(e) => {
			const {pageX, button} = e;
			if (button !== 0) {
				return;
			}

			const moveListener = (ev: MouseEvent) => {
				const xDistance = ev.pageX - pageX;
				const step = Number(_step ?? 1);
				const min = Number(_min ?? 0);
				const max = Number(_max ?? Infinity);

				const diff = interpolate(
					xDistance,
					[-5, -4, 0, 4, 5],
					[-step, 0, 0, 0, step],
				);
				const newValue = Math.min(max, Math.max(min, Number(value) + diff));
				const roundedToStep = roundToStep(newValue, step);
				onValueChange(roundedToStep);
			};

			window.addEventListener('mousemove', moveListener);
			window.addEventListener(
				'pointerup',
				() => {
					window.removeEventListener('mousemove', moveListener);
					setTimeout(() => {
					}, 2);
				},
				{
					once: true,
				},
			);
		},
		[_step, _min, _max, value, onValueChange],
	);

	useEffect(() => {
		if (inputFallback) {
			fallbackRef.current?.select();
		}
	}, [inputFallback]);


	if (inputFallback) {
		return (
            <h1>fallback</h1>
		);
	}

	return (
		<button
			ref={ref}
			type="button"
			style={style}
			onClick={onClick}
			onPointerDown={onPointerDown}
		>
			<span style={span}>{formatter(value as string | number)}</span>
		</button>
	);
};

export const InputDragger = React.forwardRef(InputDraggerForwardRefFn);
