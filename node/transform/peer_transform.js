function peer_transform(peer_data, list_of_get) {
    let closed_fields = ["secrets", "tx_hash", "tx_time_stamp"];
    const open_fields = {};
    if (list_of_get && list_of_get.length) {
        list_of_get.forEach(l => {
            closed_fields = closed_fields.filter(field => field != l);
        });
    }

    Object.entries(peer_data).forEach(([key, val]) => {
        if (!closed_fields.includes(key)) {
            open_fields[key] = val;
        };
    });

    return open_fields;
}

module.exports = peer_transform;