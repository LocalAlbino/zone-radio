using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using SharpHook.Data;

namespace ZoneRadio;

/// <summary>
/// Interaction logic for KeybindCard.xaml
/// </summary>
public partial class KeybindCard : UserControl
{
    public KeybindCard()
    {
        InitializeComponent();
        KeybindSelection.ItemsSource = Enum.GetValues<KeyCode>();
    }

    public string Title
    {
        get => (string)GetValue(TitleProperty);
        set => SetValue(TitleProperty, value);
    }
    public static readonly DependencyProperty TitleProperty =
        DependencyProperty.Register("Title", typeof(string), typeof(KeybindCard), new PropertyMetadata("Title"));

    public string Description
    {
        get => (string)GetValue(DescriptionProperty);
        set => SetValue(DescriptionProperty, value);
    }
    public static readonly DependencyProperty DescriptionProperty =
        DependencyProperty.Register("Description", typeof(string), typeof(KeybindCard), new PropertyMetadata("Description"));
}
