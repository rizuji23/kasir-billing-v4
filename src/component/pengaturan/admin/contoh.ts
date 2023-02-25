const data = [
{
nama: "TEST"
},
{
nama: "TEST"
},
{
nama: "TEST1"
},
{
nama: "TEST"
},
{
nama: "TEST1"
},
{
nama: "TEST2"
},
{
nama: "TEST3"
},
{
nama: "TEST3"
},
{
nama: "TEST3"
},
{
nama: "TEST3"
},
{
nama: "TEST3"
}
]

const ids = data.map(o => o.nama);
const filter = data.filter(({nama}, i) => !ids.includes(nama, i + 1))
console.log(filter)