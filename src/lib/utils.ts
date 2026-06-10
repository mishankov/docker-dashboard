export const formatMemorySize = (mem: string = '0') => {
	const memNum = Number(mem);
	const variants = [
		{ value: 1024 * 1024 * 1024, text: 'GiB' },
		{ value: 1024 * 1024, text: 'MiB' },
		{ value: 1024, text: 'KiB' }
	];

	for (const { value, text } of variants) {
		if (memNum > value) return (memNum / value).toFixed(2) + ' ' + text;
	}

	return memNum.toFixed(2) + ' B';
};

export const trimLong = (input: string, max = 30) => {
	if (input.length > max) {
		return input.slice(0, max - 3) + '...';
	}
	return input;
};
