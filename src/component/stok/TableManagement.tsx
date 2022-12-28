import React from "react";

class TableManagement extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <>
                <table className="table table-custom">
                    <thead>
                        <tr>
                            <th rowSpan={2} className="border-end">No</th>
                            <th rowSpan={2} className="border-end">Nama Barang</th>
                            <th rowSpan={2} className="border-end">Stok Awal</th>
                            <th rowSpan={2}>Barang Masuk</th>
                            <th colSpan={2} className=" border-end border-start">Shift 1</th>
                            <th colSpan={2} className=" border-end border-start">Shift 2</th>
                            <th rowSpan={2} className="border-end">Stok Akhir</th>
                            <th rowSpan={2}>Keterangan</th>
                        </tr>
                        <tr>
                            <th className="border-start">Terjual</th>
                            <th className="">Sisa</th>
                            <th className=" border-start">Terjual</th>
                            <th className="border-end ">Sisa</th>
                        </tr>

                    </thead>
                    <tbody>
                        {this.props.data}
                    </tbody>
                </table>
            </>
        )
    }
}

export default TableManagement;