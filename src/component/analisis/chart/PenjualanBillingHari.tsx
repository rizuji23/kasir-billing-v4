import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';


class PenjualanBillingHari extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <>
                <ResponsiveContainer width={"100%"} aspect={2}>
                    <AreaChart
                        width={400}
                        height={200}
                        data={this.props.data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" style={{ fontSize: "12px" }} />
                        <YAxis style={{ fontSize: "12px" }} />
                        <Tooltip />
                        <Legend />

                        <Area type="monotone" dataKey="total_cafe" stackId="1" stroke="#8884d8" fill="#8884d8" />
                        <Area type="monotone" dataKey="total_billing" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                </ResponsiveContainer>
            </>
        )
    }
}

export default PenjualanBillingHari;