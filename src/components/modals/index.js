import CreateChannelModal from './CreateChannelModal.jsx';
import RenameChannelModal from './RenameChannelModal.jsx';
import DeleteChannelModal from './DeleteChannelModal.jsx';

const modals = {
  new: CreateChannelModal,
  delete: DeleteChannelModal,
  rename: RenameChannelModal,
};

export default (modalName) => modals[modalName];
