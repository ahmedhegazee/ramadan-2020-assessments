let videoRequests = [];
let sortType = "new";
let searchQuery = "";
const videoReqList = document.getElementById("listOfRequests");
function getVideoRequests() {
  manipulateApiData(
    `http://localhost:7777/video-request?sortType=${sortType}&searchQuery=${searchQuery}`,
    "get"
  ).then((res) => {
    videoRequests = res;
    showVideoRequest(res);
  });
}
function manipulateApiData(url, method, data) {
  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    // body: data,
  })
    .then((response) => response.json())

    .catch((error) => {
      console.error("Error:", error);
    });
}
function addVote(id, vote_type) {
  let data = { id, vote_type };
  manipulateApiData(
    "http://localhost:7777/video-request/vote",
    "put",
    data
  ).then((res) => {
    const voteScore = document.getElementById(`votes_score_${id}`);
    voteScore.innerHTML = formatVoteScore(res);
  });
}
//to delay request after specific time to decrease amount of requests to server
function debounce(fn, time) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), time);
  };
}
function sortVideoRequests(type) {
  let otherType = type === "new" ? "top_voted" : "new";
  //front end way
  let typeButton = document.getElementById(`sort_${type}`);
  let otherTypedButton = document.getElementById(`sort_${otherType}`);
  typeButton.classList.remove("btn-outline-primary");
  typeButton.classList.add("btn-primary");
  otherTypedButton.classList.add("btn-outline-primary");
  otherTypedButton.classList.remove("btn-primary");
  // let sortedArray = [];
  // if (type == "new") {
  //   sortedArray = videoRequests.sort(
  //     (a, b) => a.submit_date < b.submit_date
  //   );
  // } else {
  //   sortedArray = videoRequests.sort(
  //     (a, b) => formatVoteScore(a.votes) < formatVoteScore(b.votes)
  //   );
  // }
  // showVideoRequest(sortedArray);
  sortType = type;
  getVideoRequests();
}
function showVideoRequest(videoRequests) {
  videoReqList.innerHTML = "";
  videoRequests.forEach((req) => {
    let videoReq = document.createElement("div");
    videoReq.innerHTML = formatVideoReq(req);
    videoReqList.append(videoReq);
  });
}
function addNewVideo() {
  const formVidReq = document.getElementById("formVideoRequest");
  formVidReq.addEventListener("submit", (event) => {
    event.preventDefault();
    const elements = document.querySelectorAll(
      "#formVideoRequest .form-control"
    );

    // let formData = new FormData(formVidReq);
    let data = {};
    elements.forEach((element) => {
      data[element.name] = element.value;
    });
    if (!isValidData(data)) return;
    manipulateApiData("http://localhost:7777/video-request", "post", data).then(
      (res) => {
        let videoReq = document.createElement("div");
        videoReq.innerHTML = formatVideoReq(res);
        videoReqList.prepend(videoReq);
        videoRequests.push(res);
        formVidReq.reset();
      }
    );
  });
}
function applySearch() {
  // searchInput.addEventListener("input", (event) => {
  //   searchQuery = searchInput.value;
  //   getVideoRequests();
  // });
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener(
    "input",
    debounce((event) => {
      searchQuery = searchInput.value;
      getVideoRequests();
    }, 500)
  );
}
