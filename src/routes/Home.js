import React, { Component } from "react";
import styled from "styled-components";
import { Card, Icon, Button, Row, Modal, Input, Col, Upload } from "antd";
import timeAgo from "node-time-ago";
import { Alldata } from "../models/Pictures";

const { Meta } = Card;

const Container = styled.div`
  padding-top: 2em;
  padding-left: 1em;
`;

const Picture = styled.div`
  width: 30em;
  display: inline-block;
  padding: 1em;
`;

const Nav = styled.div`
  padding-top: 1em;
  padding-bottom: 1em;
  border-bottom: 1px solid #eeeeee;
`;

const Logo = styled.div`
  font-size: 2em;
`;

const Thumb = props => {
  let url = `url(${props.src})`;
  return (
    <div
      style={{
        backgroundImage: url,
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        borderBottom: "1px solid #eeeeee",
        width: "27.84em",
        height: "18em"
      }}
    />
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.url = React.createRef();
    this.title = React.createRef();
    this.state = {
      data: [],
      url: "",
      isLoading: true,
      visible: false,
      title: "",
      search: ""
    };
  }

  componentDidMount() {
    this.setState({
      data: this.sortPics(Alldata),
      isLoading: false
    });
  }

  sortPics = data => {
    let pics = data.sort(function(x, y) {
      return Date.parse(y.timestamp) - Date.parse(x.timestamp);
    });
    return pics;
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    let x = this.state.url;
    if (this.state.url.result) x = this.state.url.result;
    let new_data = this.state.data.concat({
      Image: x,
      timestamp: new Date(),
      title: this.state.title
    });
    Alldata.push(new_data);
    this.setState({
      data: this.sortPics(new_data)
    });
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  render() {
    return (
      <div>
        <Nav>
          <Row type="flex" justify="space-around" align="middle">
            <Col span={2}>
              <Logo>PicShare</Logo>
            </Col>
            <Col span={8}>
              <div>
                <Input
                  placeholder="Search"
                  onChange={e => {
                    let text = e.target.value;
                    if (text == "") this.setState({data: Alldata});
                    else {
                      let data2 = this.state.data.filter(d => {
                        return d.title.startsWith(text);
                      });
                      this.setState({ data: data2 });
                    }
                  }}
                  prefix={
                    <Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                />
              </div>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={4}>
                  <Button size="large" icon="plus" onClick={this.showModal}>
                    Upload Image
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Nav>
        <Container>
          <Modal
            title="Upload Image"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={[
              <Button key="cancel" onClick={this.handleCancel}>
                Cancel
              </Button>,
              <Button key="upload" type="primary" onClick={this.handleOk}>
                Upload
              </Button>
            ]}
          >
            <Row type="flex" justify="center" align="middle">
              <Col span={8}>
                <Upload
                  action={e => {
                    return new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result);
                      reader.onerror = error => reject(error);
                      reader.readAsDataURL(e);
                      console.log(reader);
                      this.setState({ url: reader });
                    });
                  }}
                >
                  <Button>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>
              </Col>
              <Col span={2}>OR</Col>
              <Col span={12}>
                <Input
                  type="text"
                  placeholder="Enter URL of the image"
                  value={this.state.url}
                  onChange={e => {
                    this.setState({ url: e.target.value });
                  }}
                />
              </Col>
            </Row>
            <Row
              type="flex"
              justify="center"
              align="middle"
              style={{ paddingTop: "1em" }}
            >
              <Col span={22}>
                <Input
                  type="text"
                  placeholder="Enter Title"
                  value={this.state.title}
                  onChange={e => {
                    this.setState({ title: e.target.value });
                  }}
                />
              </Col>
            </Row>
          </Modal>
          {!this.state.isLoading &&
            this.state.data.map((pic, index) => (
              <Picture key={index}>
                <Card cover={<Thumb src={pic.Image} />}>
                  <Meta
                    title={
                      <Row type="flex" justify="space-between">
                        {pic.title}
                        <Button
                          shape="circle"
                          icon="delete"
                          type="danger"
                          onClick={() => {
                            let pics = this.state.data;
                            pics.splice(index, 1);
                            this.setState({
                              data: this.sortPics(pics)
                            });
                          }}
                        />
                      </Row>
                    }
                    description={timeAgo(pic.timestamp)}
                  />
                </Card>
              </Picture>
            ))}
        </Container>
      </div>
    );
  }
}

export default App;
