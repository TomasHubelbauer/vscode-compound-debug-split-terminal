console.log('FE');
void async function stall() {
    await new Promise(resolve => {});
}
