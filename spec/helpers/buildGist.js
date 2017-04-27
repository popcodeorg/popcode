import each from 'lodash/each';
import {createGistFromProject} from '../../src/clients/Gists';
import buildProject from './buildProject';

export default function buildGist(gistId, ...projectArgs) {
  const gistData = createGistFromProject(buildProject(...projectArgs));
  each(
    gistData.files,
    (file, filename) => {
      file.filename = filename;
    },
  );
  gistData.id = gistId;
  return gistData;
}
