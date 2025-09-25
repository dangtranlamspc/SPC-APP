import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import RenderHtml, { MixedStyleDeclaration } from 'react-native-render-html';

const { width } = Dimensions.get('window');

interface HtmlDescriptionProps {
  htmlContent: string;
  containerStyle?: any;
}

export default function HtmlDescription({ htmlContent, containerStyle }: HtmlDescriptionProps) {
  // Custom styles cho HTML elements
  const tagsStyles: Record<string, MixedStyleDeclaration> = {
    p: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 12,
      color: '#374151',
    },
    strong: {
      fontWeight: '700',
      color: '#1f2937',
      textAlign : 'center'
    },
    b: {
      fontWeight: '700',
      color: '#1f2937',
    },
    table: {
      borderWidth: 1,
      borderColor: '#d1d5db',
      borderRadius: 8,
      marginVertical: 16,
      backgroundColor: '#fff',
      width: '100%',
    },
    tr: {
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      flexDirection: 'row',
    },
    td: {
      padding: 12,
      fontSize: 14,
      color: '#374151',
      borderRightWidth: 1,
      borderRightColor: '#e5e7eb',
      flex: 1,
      textAlign : 'center',
      justifyContent : 'center',
    },
    th: {
      padding: 12,
      fontSize: 14,
      fontWeight: '700',
      backgroundColor: '#f9fafb',
      color: '#1f2937',
      borderRightWidth: 1,
      borderRightColor: '#e5e7eb',
      flex: 1,
      textAlign: 'left',
    }
  };

  // System fonts để đảm bảo hiển thị đúng
  const systemFonts = [
    'System',
    'SF Pro Display',
    'SF Pro Text', 
    'Roboto',
    'sans-serif'
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      <RenderHtml
        contentWidth={Math.max(width - 32, 400)} // Trừ padding
        source={{ html: htmlContent }}
        tagsStyles={tagsStyles}
        systemFonts={systemFonts}
        defaultTextProps={{
          selectable: true // Cho phép select text
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});