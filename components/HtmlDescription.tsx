import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import RenderHtml, { MixedStyleDeclaration } from 'react-native-render-html';

const { width } = Dimensions.get('window');

interface HtmlDescriptionProps {
  htmlContent: string;
  containerStyle?: any;
}

export default function HtmlDescription({ htmlContent, containerStyle }: HtmlDescriptionProps) {
  const { theme, isDark } = useTheme();

  // Custom styles cho HTML elements với theme integration
  const tagsStyles: Record<string, MixedStyleDeclaration> = {
    p: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 12,
      color: theme.text,
    },
    strong: {
      fontWeight: '700',
      color: theme.text,
    },
    b: {
      fontWeight: '700',
      color: theme.text,
    },
    h1: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 16,
      marginTop: 20,
    },
    h2: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
      marginTop: 16,
    },
    h3: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 10,
      marginTop: 14,
    },
    h4: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
      marginTop: 12,
    },
    ul: {
      marginBottom: 16,
      marginTop: 8,
    },
    ol: {
      marginBottom: 16,
      marginTop: 8,
    },
    li: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.text,
      marginBottom: 4,
    },
    a: {
      color: theme.primary,
      textDecorationLine: 'underline',
    },
    blockquote: {
      backgroundColor: theme.surface,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
      paddingLeft: 16,
      paddingVertical: 12,
      marginVertical: 12,
      fontStyle: 'italic',
      borderRadius: 4,
    },
    code: {
      backgroundColor: theme.surface,
      color: theme.primary,
      fontSize: 14,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: 'monospace',
    },
    pre: {
      backgroundColor: theme.surface,
      padding: 16,
      borderRadius: 8,
      marginVertical: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    table: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      marginVertical: 16,
      backgroundColor: theme.card,
      width: '100%',
      ...(!isDark ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      } : {}),
    },
    tr: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      flexDirection: 'row',
    },
    td: {
      padding: 12,
      fontSize: 14,
      color: theme.text,
      borderRightWidth: 1,
      borderRightColor: theme.border,
      flex: 1,
      textAlign: 'center',
      justifyContent: 'center',
    },
    th: {
      padding: 12,
      fontSize: 14,
      fontWeight: '700',
      backgroundColor: theme.surface,
      color: theme.text,
      borderRightWidth: 1,
      borderRightColor: theme.border,
      flex: 1,
      textAlign: 'center',
    },
    thead: {
      backgroundColor: theme.surface,
    },
    tbody: {
      backgroundColor: theme.card,
    },
    // Additional styling for better appearance
    img: {
      marginVertical: 12,
      borderRadius: 8,
    },
    hr: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 16,
    },
    em: {
      fontStyle: 'italic',
      color: theme.textSecondary,
    },
    i: {
      fontStyle: 'italic',
      color: theme.textSecondary,
    },
    small: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    // Custom classes (nếu HTML có class)
    '.highlight': {
      backgroundColor: theme.primary + '20',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    '.warning': {
      backgroundColor: theme.warning + '15',
      borderLeftWidth: 4,
      borderLeftColor: theme.warning,
      paddingLeft: 12,
      paddingVertical: 8,
      marginVertical: 8,
      borderRadius: 4,
    },
    '.info': {
      backgroundColor: theme.primary + '15',
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
      paddingLeft: 12,
      paddingVertical: 8,
      marginVertical: 8,
      borderRadius: 4,
    },
  };

  // System fonts để đảm bảo hiển thị đúng
  const systemFonts = [
    'System',
    'SF Pro Display',
    'SF Pro Text', 
    'Roboto',
    'sans-serif'
  ];

  const styles = createStyles(theme, isDark);

  return (
    <View style={[styles.container, containerStyle]}>
      <RenderHtml
        contentWidth={Math.max(width - 64, 300)} // Responsive width
        source={{ html: htmlContent }}
        tagsStyles={tagsStyles}
        systemFonts={systemFonts}
        defaultTextProps={{
          selectable: true, // Cho phép select text
          style: {
            color: theme.text, // Default text color
          }
        }}
        // Custom renderers cho better control (nếu cần)
        renderers={{
          // Custom renderer cho tables nếu cần xử lý đặc biệt
        }}
        // Base style cho toàn bộ HTML content
        baseStyle={{
          color: theme.text,
          fontSize: 16,
        }}
        // Compute embedded maximum width
        computeEmbeddedMaxWidth={(contentWidth) => contentWidth}
      />
    </View>
  );
}

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});