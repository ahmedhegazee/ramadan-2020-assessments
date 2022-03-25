function formatVideoReq(req) {
  return `<div class="card mb-3">
          <div class="card-body d-flex justify-content-between flex-row">
            <div class="d-flex flex-column">
              <h3>${req.topic_title}</h3>
              <p class="text-muted mb-2">${req.topic_details}</p>
              <p class="mb-0 text-muted">
                ${
                  req.expected_result &&
                  `<strong>Expected results:</strong> ${req.expected_result}`
                }
              </p>
            </div>
            <div class="d-flex flex-column text-center">
              <a class="btn btn-link" onclick="addVote('${
                req._id
              }', 'ups')">🔺</a>
              <h3 id="votes_score_${req._id}">${formatVoteScore(req.votes)}</h3>
              <a class="btn btn-link" onclick="addVote('${
                req._id
              }', 'downs')">🔻</a>
            </div>
          </div>
          <div class="card-footer d-flex flex-row justify-content-between">
            <div>
              <span class="text-info">${req.status}</span>
              &bullet; added by <strong>${req.author_name}</strong> on
              <strong>${new Date(req.submit_date).toLocaleString()}</strong>
            </div>
            <div
              class="d-flex justify-content-center flex-column 408ml-auto mr-2"
            >
              <div class="badge badge-success">${req.target_level}</div>
            </div>
          </div>
        </div>`;
}
function formatVoteScore({ ups, downs }) {
  return ups - downs;
}
