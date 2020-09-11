$(document).ready(async function () {
  $('.tabs').tabs();

  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");

  const res = await getFavById(parseInt(idParam));
  if (res) {
    $('#favorite').html('<i class="material-icons primary-text">favorite</i>')
    getSavedArticleById(res);
    $('#favorite').click(() => {
      deleteFavById(parseInt(idParam));
    });
  } else {
    const clubDetail = getDetail();
    $('#favorite').click(() => {
      clubDetail.then((detail) => {
        saveDetail(detail);
      })
    });
  }
});