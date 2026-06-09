import Dockerode from 'dockerode';

// TODO: handle different OSs
export const docker = new Dockerode({ socketPath: '/var/run/docker.sock' });
