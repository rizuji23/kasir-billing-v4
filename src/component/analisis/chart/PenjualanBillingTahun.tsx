import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Legend, Bar } from 'recharts';


class PenjualanBillingTahun extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <>
                <ResponsiveContainer width={"100%"} aspect={2}>
                    <BarChart
                        width={500}
                        height={300}
                        data={this.props.data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" style={{ fontSize: "12px" }} />
                        <YAxis style={{ fontSize: "12px" }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total_cafe" fill="#8884d8" />
                        <Bar dataKey="total_billing" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </>
        )
    }
}

export default PenjualanBillingTahun;