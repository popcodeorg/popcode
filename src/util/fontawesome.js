import {library} from '@fortawesome/fontawesome-svg-core';
import {
  faBan,
  faBars,
  faCaretDown,
  faCheck,
  faCheckCircle,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faExchangeAlt,
  faExternalLinkAlt,
  faInfoCircle,
  faSearchMinus,
  faSearchPlus,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';

import {
  faGithub,
  faSlackHash,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';

export default function() {
  library.add(faBan);
  library.add(faBars);
  library.add(faCaretDown);
  library.add(faCheck);
  library.add(faCheckCircle);
  library.add(faChevronDown);
  library.add(faChevronLeft);
  library.add(faChevronRight);
  library.add(faChevronUp);
  library.add(faExchangeAlt);
  library.add(faExternalLinkAlt);
  library.add(faInfoCircle);
  library.add(faSearchMinus);
  library.add(faSearchPlus);
  library.add(faSyncAlt);

  library.add(faGithub);
  library.add(faSlackHash);
  library.add(faTwitter);
}
