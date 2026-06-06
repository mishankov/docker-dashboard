<script lang="ts">
	import { streamStats } from './main.remote';

	const stats = streamStats();

	const formatMem = (mem: string) => {
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
</script>

<h3>CPU</h3>
<p>{(await stats).CPUPrec}%</p>

<h3>RAM</h3>
<p>{formatMem((await stats).MemUsage)} ({(await stats).MemPerc}%)</p>
