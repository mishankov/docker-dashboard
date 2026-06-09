import { docker } from './docker';

export const getStats = async () => {
	let CPUPerc = 0;
	let CPULimit = 0;
	let MemUsage = 0;
	let MemLimit = 0;

	const containers = await docker.listContainers();

	const statsList = await Promise.all(
		containers.map(({ Id }) => docker.getContainer(Id).stats({ stream: false }))
	);

	for (const stats of statsList) {
		const cpuDelta =
			stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;

		const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;

		const onlineCpus =
			stats.cpu_stats.online_cpus || stats.cpu_stats.cpu_usage.percpu_usage?.length || 1;

		if (systemDelta > 0 && cpuDelta > 0) {
			CPUPerc += (cpuDelta / systemDelta) * onlineCpus * 100;
		}

		CPULimit = stats.cpu_stats.online_cpus * 100;
		MemUsage += stats.memory_stats.usage;
		MemLimit = stats.memory_stats.limit;
	}

	const MemPerc = MemLimit > 0 ? (MemUsage / MemLimit) * 100 : 0;

	return {
		CPUPerc: CPUPerc.toFixed(2),
		CPULimit: CPULimit.toFixed(2),
		MemPerc: MemPerc.toFixed(2),
		MemUsage: MemUsage.toFixed(2),
		MemLimit: MemLimit.toFixed(2)
	};
};
