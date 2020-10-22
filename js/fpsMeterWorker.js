const times = [];

onmessage = ((message)=>{
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
    }
    times.push(now);
    postMessage(times.length);
})