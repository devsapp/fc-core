import Docker from 'dockerode';
import { preExecute } from '../../src/docker/pre-execute';


const docker = new Docker();
preExecute(docker);