import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, StatusBar, View } from 'react-native';

// Components
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Project = ({ children }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 10,
      }}
    >
      <MaterialCommunityIcons name="circle" size={10} color="#aaa" />
      <Text style={styles.project}>{children}</Text>
    </View>
  );
};

class LegalScreen extends Component {
  static navigationOptions = {
    title: 'Legal',
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.list}>
          <Text style={styles.subText}>
            Budgetal uses third party open source software
          </Text>

          <Text style={styles.licenseTitle}>The MIT License(MIT)</Text>

          <Text style={styles.subText}>
            The following open source libraries are subject to the terms and
            conditions of The MIT License (MIT), included below.
          </Text>

          <Project>React, Copyright (c) 2013-present, Facebook, Inc.</Project>
          <Project>React Redux, Copyright (c) 2015-present Dan Abramov</Project>
          <Project>Redux, Copyright (c) 2015-present Dan Abramov</Project>
          <Project>
            React Native Keyboard Aware ScrollView, Copyright (c) 2015 APSL
          </Project>

          <Text style={styles.license}>
            The MIT License (MIT) http://opensource.org/licenses/MIT/ Copyright
            (c) Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation files
            (the "Software"), to deal in the Software without restriction,
            including without limitation the rights to use, copy, modify, merge,
            publish, distribute, sublicense, and/or sell copies of the Software,
            and to permit persons to whom the Software is furnished to do so,
            subject to the following conditions: The above copyright notice and
            this permission notice shall be included in all copies or
            substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS
            IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
            NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
            PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
            OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
            OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
          </Text>

          <Text style={styles.licenseTitle}>BSD 2-clause license</Text>
          <Text style={styles.subText}>
            The following open source libraries are subject to the terms and
            conditions of The BSD 2-clause license, included below.
          </Text>
          <Project>
            React Native, Copyright (c) 2015-present, Facebook, Inc.
          </Project>

          <Text style={styles.license}>
            The BSD 2-Clause License Copyright (c), All rights reserved.
            Redistribution and use in source and binary forms, with or without
            modification, are permitted provided that the following conditions
            are met: 1. Redistributions of source code must retain the above
            copyright notice, this list of conditions and the following
            disclaimer. 2. Redistributions in binary form must reproduce the
            above copyright notice, this list of conditions and the following
            disclaimer in the documentation and/or other materials provided with
            the distribution. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS
            AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
            INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
            MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
            IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
            ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
            CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
            SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
            BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
            LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
            NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
            SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
          </Text>

          <Text style={styles.licenseTitle}>BSD 3-clause license</Text>
          <Text style={styles.subText}>
            The following open source libraries are subject to the terms and
            conditions of The BSD 3-clause license, included below.
          </Text>

          <Project>
            Expo, Copyright (c) 2015-present, 650 Industries, Inc.
          </Project>

          <Project>
            React Navigation, Copyright (c) 2016-present, React Navigation
            Contributors
          </Project>

          <Text style={styles.license}>
            Redistribution and use in source and binary forms, with or without
            modification, are permitted provided that the following conditions
            are met: 1. Redistributions of source code must retain the above
            copyright notice, this list of conditions and the following
            disclaimer. 2. Redistributions in binary form must reproduce the
            above copyright notice, this list of conditions and the following
            disclaimer in the documentation and/or other materials provided with
            the distribution. 3. Neither the name of the copyright holder nor
            the names of its contributors may be used to endorse or promote
            products derived from this software without specific prior written
            permission. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
            CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
            INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
            MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
            IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
            ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
            CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
            SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
            BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
            LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
            NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
            SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
          </Text>

          <Text style={styles.licenseTitle}>
            Dual licensed under GPLv2 & MIT
          </Text>
          <Text style={styles.subText}>
            The following open source libraries are subject to the terms and
            conditions of both the GPLv2 & MIT license, included below.
          </Text>

          <Project>UA parser js, Copyright © 2012-2016 Faisal Salman</Project>

          <Text style={styles.license}>
            Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation files
            (the "Software"), to deal in the Software without restriction,
            including without limitation the rights to use, copy, modify, merge,
            publish, distribute, sublicense, and/or sell copies of the Software,
            and to permit persons to whom the Software is furnished to do so,
            subject to the following conditions: The above copyright notice and
            this permission notice shall be included in all copies or
            substantial portions of the Software.
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
  },
  list: {
    padding: 10,
    width: '100%',
  },
  license: {
    backgroundColor: '#ccc',
    fontFamily: 'Menlo',
    fontSize: 10,
    padding: 10,
    marginBottom: 20,
  },
  licenseTitle: {
    fontSize: 20,
    color: '#444',
    fontWeight: '700',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#555',
  },
  project: {
    padding: 8,
    fontSize: 14,
    color: '#555',
  },
});

export default LegalScreen;
