const { v4: uuidv4 } = require('uuid');

let maintenanceRequests = [];

const createMaintenanceRequest = (requestData) => {
  const newRequest = {
    id: uuidv4(),
    ...requestData,
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  maintenanceRequests.push(newRequest);
  return newRequest;
};

const getOpenMaintenanceRequests = () => {
  return maintenanceRequests.filter(request => request.status === 'open');
};

const closeMaintenanceRequest = (id) => {
  const requestIndex = maintenanceRequests.findIndex(request => request.id === id);
  if (requestIndex === -1) {
    return null;
  }
  
  maintenanceRequests[requestIndex].status = 'closed';
  maintenanceRequests[requestIndex].updatedAt = new Date().toISOString();
  
  return maintenanceRequests[requestIndex];
};

module.exports = {
  createMaintenanceRequest,
  getOpenMaintenanceRequests,
  closeMaintenanceRequest
};
