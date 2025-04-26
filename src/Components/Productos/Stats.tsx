import React from 'react';
import { LaptopOutlined,DollarOutlined,SubnodeOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';


interface CardProps {
  isDarkMode: boolean ;  
}


const valores = [{
  title: "Productos",
  value: 605,
  icon: <LaptopOutlined />,
},
{
  title: "Marcas",
  value: 50,
  icon: <SubnodeOutlined />,
},
{
  title: "Ventas",
  value: 400,
  icon: <DollarOutlined />,
},
{
  title: "Compras",
  value: 300,
  icon: <DollarOutlined />,
}]


const App: React.FC<CardProps> = ( {isDarkMode})=> (

  
  <Row gutter={32}>
    {valores.map((e)=>(
      <Col span={6} key={e.title}>  
        <Card style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', borderRadius: '8px' }}>
          <Statistic
            title={<span style={{ fontSize: '18px', fontWeight: "700",color: isDarkMode ? '#fff' : 'black' }}>{e.title}</span>}
            value={e.value}
       
            prefix={e.icon}
          />
        </Card>
      </Col>))}
  </Row>
);

export default App;