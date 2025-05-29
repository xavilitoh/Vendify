import React from 'react';
import { LaptopOutlined, DollarOutlined, SubnodeOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';

interface CardProps {
  isDarkMode: boolean;
}

const valores = [
  {
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
    value: 450,
    icon: <DollarOutlined />,
  },
  {
    title: "Compras",
    value: 300,
    icon: <DollarOutlined />,
  },
];

const App: React.FC<CardProps> = ({ isDarkMode }) => (
  <Row gutter={[16, 16]}>
    {valores.map((e) => (
      <Col
        key={e.title}
        xs={24}  // 1 per row on mobile
        sm={12}  // 2 per row on small screens
        md={12}  // 2 per row on medium screens
        lg={8}   // 3 per row on large screens
        xl={6}   // 4 per row on extra-large screens
      >
        <Card
          style={{
            backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
            borderRadius: '8px',
          }}
        >
          <Statistic
            title={
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: isDarkMode ? '#fff' : 'black',
                }}
              >
                {e.title}
              </span>
            }
            value={e.value}
            prefix={e.icon}
          />
        </Card>
      </Col>
    ))}
  </Row>
);

export default App;
