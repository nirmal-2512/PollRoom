export const getVoterId = () => {
  let voterId = localStorage.getItem("voterId");

  if (!voterId) {
    voterId = crypto.randomUUID();
    localStorage.setItem("voterId", voterId);
  }

  return voterId;
};
