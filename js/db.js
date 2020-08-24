let dbPromised = idb.open("uclDB", 1, function (upgradeDb) {
    let detailObjectStore = upgradeDb.createObjectStore("club-detail", {
        keyPath: "id"
    });
    detailObjectStore.createIndex("name", "name", { unique: false });
});

function saveDetail(detail) {
    dbPromised
        .then(function (db) {
            let tx = db.transaction("club-detail", "readwrite");
            let clubDetail = tx.objectStore("club-detail");
            console.log(detail);
            clubDetail.add(detail);
            return tx.complete;
        })
        .then(() => {
            M.toast({ html: 'Club berhasil disimpan', classes: "green" })
            setTimeout(() => {
                window.location = "index.html"
            }, 1200)
        }).catch(() => {
            M.toast({ html: 'Club gagal disimpan', classes: "red" })
        });
}

function getAll() {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("club-detail", "readonly");
                var store = tx.objectStore("club-detail");
                return store.getAll();
            })
            .then(function (clubDetail) {
                resolve(clubDetail);
            });
    });
}

function getFavById(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("club-detail", "readonly");
                var store = tx.objectStore("club-detail");
                return store.get(id);
            })
            .then(function (clubDetail) {
                resolve(clubDetail);
            });
    });
}

function deleteFavById(id) {
    dbPromised
        .then(function (db) {
            var tx = db.transaction("club-detail", "readwrite");
            var store = tx.objectStore("club-detail");
            return store.delete(id);
        })
        .then(() => {
            M.toast({ html: 'Club berhasil dihapus', classes: "green" })
            setTimeout(() => {
                window.location = "index.html"
            }, 1200)
        }).catch(() => {
            M.toast({ html: 'Club gagal dihapus', classes: "red" })
        });
}